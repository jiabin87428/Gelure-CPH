//
//  WebViewController.m
//  chehaoyunV2.0
//
//  Created by 吴畏 on 15/12/9.
//  Copyright © 2015年 Frank ww. All rights reserved.
//

#import "WebViewController.h"

@interface WebViewController ()<UITableViewDelegate,UIDocumentInteractionControllerDelegate>{
    UITableView *_tableView;
    UIWebView *webview;
    
    UIDocumentInteractionController *_documentInter;
}
@end

@implementation WebViewController

- (void)viewDidLoad {
    self.navigationItem.title = self.title;
    self.view.backgroundColor = [UIColor whiteColor];
    
    if (_needNavigation) {
        self.navigationItem.title = _titleName;
        [self.navigationController.navigationBar setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIColor whiteColor],NSForegroundColorAttributeName,nil]];
        //隐藏导航栏返回文字
        [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(0, -60) forBarMetrics:UIBarMetricsDefault];
        self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:0/255.0 green:160/255.0 blue:223/255.0 alpha:1];
        
        UIButton *closeButton = [[UIButton alloc]initWithFrame:CGRectMake(0,0,35,18)];
        [closeButton setTitle:@"关闭" forState:UIControlStateNormal];
        closeButton.titleLabel.font = [UIFont systemFontOfSize: 14.0];
        [closeButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        //添加点击事件
        [closeButton addTarget:self action:@selector(closeClick:) forControlEvents:UIControlEventTouchUpInside];
        UIBarButtonItem*leftItem = [[UIBarButtonItem alloc]initWithCustomView:closeButton];
        [self.navigationItem setLeftBarButtonItem:leftItem];
        
        UIButton *morebtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 32, 32)];
        [morebtn setBackgroundImage:[UIImage imageNamed:@"more.png"] forState:UIControlStateNormal];
        [morebtn addTarget:self action:@selector(moreClick:) forControlEvents:UIControlEventTouchUpInside];
        UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithCustomView:morebtn];
        self.navigationItem.rightBarButtonItem = item;
    }
    
    //初始化样式
    [self setStyle];
    
    [self addNotification];
}

//关闭窗口事件
- (void)closeClick:(UIButton *)btn{
    [self dismissViewControllerAnimated:YES completion:nil];
}

-(void)moreClick:(UIButton *)sender{
    __block WebViewController *weakSelf = self;
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    UIAlertAction *cameraAction = [UIAlertAction actionWithTitle:@"使用其他应用打开" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
        _documentInter =
        [UIDocumentInteractionController
         interactionControllerWithURL:[NSURL fileURLWithPath:_urlString]];
        _documentInter.delegate = weakSelf;
        
        _documentInter.UTI = @"com.microsoft.word.doc";
        [_documentInter presentOpenInMenuFromRect:CGRectZero
                                           inView:weakSelf.view
                                         animated:YES];
    }];
    
    [alertController addAction:cameraAction];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:nil];
    
    [alertController addAction:cancelAction];
    //弹出视图
    [self presentViewController:alertController animated:YES completion:nil];
}

- (void)addNotification
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(beginPlayVideo:)
                                                 name:UIWindowDidBecomeVisibleNotification
                                               object:self.view.window];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(endPlayVideo:)
                                                 name:UIWindowDidBecomeHiddenNotification
                                               object:self.view.window];
}

- (void)removeNotification
{
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIWindowDidBecomeVisibleNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIWindowDidBecomeHiddenNotification
                                                  object:nil];
}

-(void)beginPlayVideo:(NSNotification *)notification{
    
}

-(void)endPlayVideo:(NSNotification *)notification{
    NSLog(@"结束");
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(void)setStyle{
    float with = 375.00;
    float heigh = 667.00;
    float withDiff,heighDiff ;
    float screanWith = [[UIScreen mainScreen] bounds].size.width;
    float screanHeigh = [[UIScreen mainScreen] bounds].size.height;
    withDiff = screanWith/with*1.042;
    heighDiff = screanHeigh/heigh*0.865;
    
    webview = [[UIWebView alloc]initWithFrame:CGRectMake(0, 0, screanWith, screanHeigh)];
    webview.scrollView.bounces = NO;
    webview.delegate = self;
    webview.scalesPageToFit = YES;
    [self loadWeb];
    [self.view addSubview:webview];
}
-(void)loadWeb{
    webview.scrollView.bounces = NO;
    NSString* encodedString = [_urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:encodedString]];
    [webview loadRequest:request];
    
}

-(void)webViewDidStartLoad:(UIWebView *)webView{
    
}

-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
    //    [Tools showMessage:@"系统繁忙 请稍候再试!"];
    
}
-(void)webViewDidFinishLoad:(UIWebView *)webView{
    
}
-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    return YES;
}

-(void)dealloc{
    [self removeNotification];
}

@end
