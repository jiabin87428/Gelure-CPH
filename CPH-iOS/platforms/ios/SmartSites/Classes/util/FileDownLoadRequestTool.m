//
//  FileDownLoadRequestTool.m
//  sck-ios
//
//  Created by 李家斌 on 16/5/18.
//  Copyright © 2016年 gelure. All rights reserved.
//

#import "FileDownLoadRequestTool.h"
#import "LodingView.h"

@interface FileDownLoadRequestTool (){
    LodingView *_loadingView;
}

@property (nonatomic, copy) downLoadCompleteBlock myBlock;

@end

@implementation FileDownLoadRequestTool

- (instancetype)initWithBlock:(downLoadCompleteBlock)block{
    if (self = [super init]) {
        self.myBlock = block;
    }
    return self;
}

//发送请求
-(void)downWithUrl:(NSURL *)url withFileName:(NSString *)fileNamed{
    _fileName = fileNamed;
//    // 创建请求
//    NSURLRequest* request = [NSURLRequest requestWithURL:url];
//    // 生成一个post请求回调委托对象（实现了<NSURLConnectionDataDelegate>协议）
//    FileDownLoadRequestTool *artDelegate = [[FileDownLoadRequestTool alloc] init];
//    artDelegate.finishCallbackBlock = block; // 绑定执行完成时的block
//    NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:artDelegate];
    
    // 创建请求
    NSURLRequest* request = [NSURLRequest requestWithURL:url];
    // 发送请求去下载 (创建完conn对象后，会自动发起一个异步请求)
    [NSURLConnection connectionWithRequest:request delegate:self];
    _loadingView = [[LodingView alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height) withStyle:@"2" withTitle:@"正在下载 0/0"];
    _loadingView.tag = 5002;
    [[UIApplication sharedApplication].keyWindow addSubview:_loadingView];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    // 文件路径
    NSString* ceches = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
//    NSString* filepath = [ceches stringByAppendingPathComponent:response.suggestedFilename];
    NSString* filepath = [ceches stringByAppendingPathComponent:_fileName];
    
    // 创建一个空的文件到沙盒中
    NSFileManager* mgr = [NSFileManager defaultManager];
    [mgr createFileAtPath:filepath contents:nil attributes:nil];
    
    // 创建一个用来写数据的文件句柄对象
    self.writeHandle = [NSFileHandle fileHandleForWritingAtPath:filepath];
    
    // 获得文件的总大小
    self.totalLength = response.expectedContentLength;
    
    [_loadingView setLodingLabelText:[NSString stringWithFormat:@"正在下载 %lld/%lld",self.currentLength,self.totalLength]];
}
/**
 *  2.当接收到服务器返回的实体数据时调用（具体内容，这个方法可能会被调用多次）
 *
 *  @param data       这次返回的数据
 */
- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    // 移动到文件的最后面
    [self.writeHandle seekToEndOfFile];
    
    // 将数据写入沙盒
    [self.writeHandle writeData:data];
    
    // 累计写入文件的长度
    self.currentLength += data.length;
    
    [_loadingView setLodingLabelText:[NSString stringWithFormat:@"正在下载 %lld/%lld",self.currentLength,self.totalLength]];
    
    // 下载进度
//    self.myPregress.progress = (double)self.currentLength / self.totalLength;
}
/**
 *  3.加载完毕后调用（服务器的数据已经完全返回后）
 */
- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    self.currentLength = 0;
    self.totalLength = 0;
    
    // 关闭文件
    [self.writeHandle closeFile];
    self.writeHandle = nil;
    self.myBlock(1);
    [[[UIApplication sharedApplication].keyWindow viewWithTag:5002] removeFromSuperview];
}

//网络请求过程中，出现任何错误（断网，连接超时等）会进入此方法
-(void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error{
    self.myBlock(0);
    [[[UIApplication sharedApplication].keyWindow viewWithTag:5002] removeFromSuperview];
}

@end
