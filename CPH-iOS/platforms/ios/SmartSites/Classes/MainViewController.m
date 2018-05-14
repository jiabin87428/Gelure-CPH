/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  SmartSites
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"

#import <JavaScriptCore/JSContext.h>
#import <JavaScriptCore/JSValue.h>
#import <JavaScriptCore/JSManagedValue.h>
#import <JavaScriptCore/JSVirtualMachine.h>
#import <JavaScriptCore/JSExport.h>

#import "ClientService.h"
#import "AppDelegate.h"
#import "ElecContractController.h"
#import "WebViewController.h"

@implementation MainViewController

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
    // you can do so here.
    
    [super viewWillAppear:animated];
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7) {
        
        CGRect viewBounds = [self.webView bounds];
        
        viewBounds.origin.y = 20;
        
        viewBounds.size.height = viewBounds.size.height;
        
        UIView *statusBackView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIApplication sharedApplication].statusBarFrame.size.height)];
        statusBackView.backgroundColor = [UIColor colorWithRed:0/255.0 green:160/255.0 blue:223/255.0 alpha:1];
        [self.view addSubview:statusBackView];
        
        [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
        
        self.webView.frame = viewBounds;
        self.webView.scrollView.backgroundColor = [UIColor colorWithRed:233/255.0 green:233/255.0 blue:233/255.0 alpha:1];
        
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

/* Comment out the block below to over-ride */

/*
 - (UIWebView*) newCordovaViewWithFrame:(CGRect)bounds
 {
 return[super newCordovaViewWithFrame:bounds];
 }
 */

#pragma mark UIWebDelegate implementation

- (void)webViewDidFinishLoad:(UIWebView*)theWebView
{
    // Black base color for background matches the native apps
    theWebView.backgroundColor = [UIColor blackColor];
    JSContext *context = [self.webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
    //定义好JS要调用的方法, share就是调用的share方法名
    context[@"getUserId"] = ^() {
        NSLog(@"+++++++Begin Log+++++++");
        NSArray *args = [JSContext currentArguments];
        AppDelegate *appdel = [[UIApplication sharedApplication] delegate];
        
        //        dispatch_async(dispatch_get_main_queue(), ^{
        //            UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"方式二" message:@"这是OC原生的弹出窗" delegate:self cancelButtonTitle:@"收到" otherButtonTitles:nil];
        //            [alertView show];
        //        });
        
        //        for (JSValue *jsVal in args) {
        //            NSLog(@"%@,%@", jsVal.toString,baseUrlStr);
        //        }
        appdel.userID = ((JSValue*)[args objectAtIndex:0]).toString;
        appdel.sendPushIdUrl = ((JSValue*)[args objectAtIndex:1]).toString;
        
        
        [ClientService sendJPushID:appdel.JPushID andUserID:appdel.userID withURL:appdel.sendPushIdUrl withComplete:^(NSDictionary *resultDic){
            NSLog(@"%@",resultDic);
        }];
        
        NSLog(@"-------End Log-------");
    };
    
    context[@"getFile"] = ^() {
        NSLog(@"+++++++Begin Log+++++++");
        NSArray *args = [JSContext currentArguments];
        NSString *urlString = ((JSValue*)[args objectAtIndex:0]).toString;
        NSString *fileName = args.count>1?((JSValue*)[args objectAtIndex:1]).toString:@"testFileName";
        
        NSArray *nameArr =  [urlString componentsSeparatedByString:@"="];
        
        // 文件路径
        NSString* ceches = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
        NSString* filepath = [ceches stringByAppendingPathComponent:nameArr.count>0?[nameArr objectAtIndex:1]:@"testFileName"];
        NSFileManager *fileManager = [NSFileManager defaultManager];
        if ([fileManager fileExistsAtPath:filepath]==NO){
            NSLog(@"文件不存在,开始下载");
            __block MainViewController *weakSelf = self;
            [ClientService downloadFile:urlString withName:fileName withComplete:^(int resultInt){
                if(resultInt == 1){
                    NSLog(@"文件下载完成");
                    [weakSelf shareFile:filepath withName:fileName];
                }else{
                    NSLog(@"文件下载失败");
                }
            }];
        }else{
            NSLog(@"文件已存在");
            [self shareFile:filepath withName:fileName];
        }
        
        NSLog(@"-------End Log-------");
    };
    
    theWebView.backgroundColor = [UIColor blackColor];
    return [super webViewDidFinishLoad:theWebView];
}

-(void)shareFile:(NSString *)filePath withName:(NSString *)fileName{
    if([filePath hasSuffix:@".mp4"]){
        WebViewController *webVC = [[WebViewController alloc]init];
        webVC.urlString = filePath;
        [webVC loadWeb];
        [self presentViewController:webVC animated:YES completion:nil];
    }else{
        //        ElecContractController *ecVC = [[ElecContractController alloc]init];
        //        ecVC.vcTitle = fileName;
        //        ecVC.pdfURL = filePath;
        //        ecVC.tip = @"加载错误";
        //        UINavigationController *myNav = [[UINavigationController alloc]initWithRootViewController:ecVC];
        //
        //        dispatch_async(dispatch_get_main_queue(), ^{
        //            [self presentViewController:myNav animated:YES completion:^{
        //
        //            }];
        //        });
        
        WebViewController *webVC = [[WebViewController alloc]init];
        webVC.urlString = filePath;
        webVC.needNavigation = YES;
        webVC.titleName = fileName;
        [webVC loadWeb];
        
        //模态窗口
        UINavigationController *presNavigation = [[UINavigationController alloc] initWithRootViewController: webVC];
        [self presentViewController: presNavigation animated: YES completion:^{
            //弹出完成事件
        }];
        
        //        [self presentViewController:webVC animated:YES completion:nil];
        
    }
}

/* Comment out the block below to over-ride */

/*
 
 - (void) webViewDidStartLoad:(UIWebView*)theWebView
 {
 return [super webViewDidStartLoad:theWebView];
 }
 
 - (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
 {
 return [super webView:theWebView didFailLoadWithError:error];
 }
 */

- (BOOL) webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL * url = [request URL];
    
    BOOL haveInfo = NO;
    NSLog(@"%f",self.webView.frame.size.height);
    NSRange range = [[NSString stringWithFormat:@"%@",url.absoluteString] rangeOfString:@"getfile?"];//判断字符串是否包含
    if (range.length >0){//包含
        haveInfo = YES;
    }else{//不包含
        haveInfo = NO;
    }
    if (haveInfo) {
        NSString *urlString = url.absoluteString;
        NSString *fileName = @"";
        NSRange range = [urlString rangeOfString:@"filename="];//判断字符串是否包含
        if (range.length >0){//包含
            fileName = [[url.query componentsSeparatedByString:@"filename="] objectAtIndex:1];
            fileName = [fileName stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        }else{//不包含
            fileName = [[url.query componentsSeparatedByString:@"="] objectAtIndex:1];
        }
        
        // 文件路径
        NSString* ceches = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
        NSString* filepath = [ceches stringByAppendingPathComponent:fileName];
        NSFileManager *fileManager = [NSFileManager defaultManager];
        if ([fileManager fileExistsAtPath:filepath]==NO){
            NSLog(@"文件不存在,开始下载");
            __block MainViewController *weakSelf = self;
            [ClientService downloadFile:urlString withName:fileName withComplete:^(int resultInt){
                if(resultInt == 1){
                    NSLog(@"文件下载完成");
                    [weakSelf shareFile:filepath withName:fileName];
                }else{
                    NSLog(@"文件下载失败");
                }
            }];
        }else{
            NSLog(@"文件已存在");
            [self shareFile:filepath withName:fileName];
        }
        return NO;
    }
    
    return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
}

@end

@implementation MainCommandDelegate

/* To override the methods, uncomment the line in the init function(s)
 in MainViewController.m
 */

#pragma mark CDVCommandDelegate implementation

- (id)getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    return [super pathForResource:resourcepath];
}

@end

@implementation MainCommandQueue

/* To override, uncomment the line in the init function(s)
 in MainViewController.m
 */
- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

@end
